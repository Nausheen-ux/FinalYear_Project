from flask import Flask, request, jsonify
import math
import re
from collections import defaultdict

app = Flask(__name__)

# ------------------------------------------------------------------
# Pure Python TF-IDF + Cosine Similarity — no scikit-learn needed
# ------------------------------------------------------------------

def tokenize(text):
    return re.findall(r'[a-z0-9_]+', text.lower())

def compute_tf(tokens):
    tf = defaultdict(float)
    for t in tokens:
        tf[t] += 1
    total = len(tokens) if tokens else 1
    for t in tf:
        tf[t] /= total
    return tf

def compute_idf(documents):
    idf = defaultdict(float)
    N = len(documents)
    for doc in documents:
        for term in set(doc):
            idf[term] += 1
    for term in idf:
        idf[term] = math.log((N + 1) / (idf[term] + 1)) + 1
    return idf

def tfidf_vector(tokens, idf):
    tf = compute_tf(tokens)
    vec = {}
    for term, tf_val in tf.items():
        if term in idf:
            vec[term] = tf_val * idf[term]
    return vec

def cosine_similarity(vec_a, vec_b):
    dot = sum(vec_a.get(t, 0) * vec_b.get(t, 0) for t in vec_a)
    mag_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    mag_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

# ------------------------------------------------------------------
# Document builders (same logic as before)
# ------------------------------------------------------------------

def build_property_document(prop):
    parts = []
    if prop.get("city"):
        parts += [prop["city"]] * 3
    if prop.get("accommodationType"):
        parts += [prop["accommodationType"]] * 2
    if prop.get("sharing"):
        parts += [prop["sharing"].replace(" ", "_")] * 2
    if prop.get("furnishType"):
        parts.append(prop["furnishType"].replace("-", "_"))
    if prop.get("gender"):
        parts.append(prop["gender"])
    for c in prop.get("colleges", []):
        name = c.get("name", "")
        if name:
            parts += [name.replace(" ", "_")] * 2
    price = prop.get("price", 0)
    if price < 5000:
        parts.append("price_below5k")
    elif price <= 10000:
        parts.append("price_5k_10k")
    elif price <= 20000:
        parts.append("price_10k_20k")
    else:
        parts.append("price_above20k")
    return " ".join(parts).lower()

def build_user_profile(searches):
    parts = []
    for i, s in enumerate(searches):
        weight = max(1, len(searches) - i)
        if s.get("location"):
            parts += [s["location"].replace(" ", "_")] * (weight * 3)
        if s.get("accommodationType"):
            parts += [s["accommodationType"]] * (weight * 2)
        if s.get("sharing"):
            parts += [s["sharing"].replace(" ", "_")] * (weight * 2)
        if s.get("rentRange"):
            range_map = {
                "below5k":  "price_below5k",
                "5k-10k":   "price_5k_10k",
                "10k-20k":  "price_10k_20k",
                "above20k": "price_above20k",
            }
            token = range_map.get(s["rentRange"])
            if token:
                parts += [token] * weight
        if s.get("college"):
            parts += [s["college"].replace(" ", "_")] * (weight * 2)
        if s.get("genderPreference") and s["genderPreference"] != "Any":
            parts.append(s["genderPreference"])
    return " ".join(parts).lower()

# ------------------------------------------------------------------
# Route
# ------------------------------------------------------------------

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    searches   = data.get("searches", [])
    properties = data.get("properties", [])
    top_n      = data.get("top_n", 10)

    if not searches or not properties:
        return jsonify({"success": False, "message": "searches and properties are required"}), 400

    user_profile  = build_user_profile(searches)
    property_docs = [build_property_document(p) for p in properties]

    if not user_profile.strip():
        return jsonify({"success": False, "message": "Could not build user profile"}), 400

    # Tokenize all documents
    user_tokens     = tokenize(user_profile)
    property_tokens = [tokenize(doc) for doc in property_docs]

    # Compute IDF over all documents (user profile + properties)
    all_token_lists = [user_tokens] + property_tokens
    idf = compute_idf(all_token_lists)

    # Compute TF-IDF vectors
    user_vec      = tfidf_vector(user_tokens, idf)
    property_vecs = [tfidf_vector(tokens, idf) for tokens in property_tokens]

    # Score each property
    scored = [
        {
            "id": str(properties[i].get("_id", i)),
            "score": cosine_similarity(user_vec, property_vecs[i])
        }
        for i in range(len(properties))
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    results = [r for r in scored[:top_n] if r["score"] > 0]

    return jsonify({"success": True, "results": results})

# ------------------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
