import sys

import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    seq = request.args.get('seq')
    DP = nussinov(seq)
    result, path = traceback(DP, seq)
    # DP = color_path(DP, path)

    response = {
            "matrix" : DP.tolist() ,
            "dot-parantheses" : result,
            "path" : path}
    return jsonify(response), 200



def pair_check(tup):
    if tup in [('A', 'U'), ('U', 'A'), ('C', 'G'), ('G', 'C')]:
        return True
    return False

def nussinov(seq):
    N = len(seq)
    DP = np.zeros((N, N))

    for offset in range(1, N):
        for i in range(N-offset):
            j = i+offset
            scores = []
            if (pair_check((seq[i], seq[j]))):
                scores.append(DP[i+1][j-1] + 1)
            else:
                scores.append(DP[i+1][j-1])

            scores.append(DP[i+1][j])
            scores.append(DP[i][j-1])

            # bifurcation
            max_bif = -float('inf')
            for k in range(i+1, j):
                bif_score = DP[i][k] + DP[k+1][j]
                max_bif = max((bif_score, max_bif))
            scores.append(max_bif)

            DP[i][j] = max(scores)
    return DP
            
def traceback(DP, seq):
    path = []
    matches = []
    N = len(seq)
    s = []
    s.append((0, N-1))
    while (len(s) != 0):
        i, j = s.pop()
        path.append((i, j))
        if (i >= j):
            continue
        elif (i < N-1 and DP[i+1][j] == DP[i][j]):
            s.append((i+1, j))
        elif (j > 0 and DP[i][j-1] == DP[i][j]):
            s.append((i, j-1))
        elif (i < N and j >= 0 and DP[i+1][j-1]+1 == DP[i][j]):
            matches.append((i, j))
            s.append((i+1, j-1))
        else:
            for k in range(i+1, j-1):
                if (DP[i][k]+DP[k+1][j] == DP[i][j]):
                    s.append((k+1,j))
                    s.append((i, k))
                    break

    dot_bracket = ["." for _ in range(len(seq))]
    for s in matches:
        dot_bracket[min(s)] = "("
        dot_bracket[max(s)] = ")"
    return "".join(dot_bracket), path

def color_path(DP, path):
    # COLORING IN THE VISUAL PART
    for i, j in path:
        DP[i][j] = 1000000
    return DP

if __name__ == "__main__":
    # DP = nussinov(sys.argv[1])
    # print(DP)
    # result, path = traceback(DP, sys.argv[1])
    # DP = color_path(DP, path)
    # print(DP)
    # print(result)
    app.run(debug=True)
