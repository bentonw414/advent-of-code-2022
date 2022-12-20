shape_scores = {
    "X" : 1,
    "Y" : 2,
    "Z" : 3,
}

encrypt = {
    "A" : "X",
    "B" : "Y",
    "C" : "Z"
}

move_to_beats = {
    "X" : "Z",
    "Y" : "X",
    "Z" : "Y"
}

move_to_better_move = {
    "Z" : "X",
    "X" : "Y",
    "Y" : "Z"
}

def scoreForLine(line: str) -> int:
    opponent_move = encrypt[line[0]]
    my_move = line[2]
    shape_score = shape_scores[my_move]
    if my_move == opponent_move:
        return shape_score + 3
    elif move_to_beats[my_move] == opponent_move:
        return shape_score + 6
    return shape_score

def scoreForLine2(line: str) -> int:
    opponent_move = encrypt[line[0]]
    outcome = line[2]
    outcome_score = (shape_scores[outcome] - 1) * 3
    if outcome == "X": # lose
        shape_score = shape_scores[move_to_beats[opponent_move]]
    if outcome == "Z": # win
        shape_score = shape_scores[move_to_better_move[opponent_move]]
    if outcome == "Y": # draw
        shape_score = shape_scores[opponent_move]

    return shape_score + outcome_score




def solution1():
    with open("./input.txt", "r") as f:
        return sum(map(scoreForLine, f.read().split("\n")))

def solution2():
    with open("./input.txt", "r") as f:
        return sum(map(scoreForLine2, f.read().split("\n")))

print(solution1())
print(solution2())