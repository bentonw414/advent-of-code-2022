def solution1():
    with open("./input.txt", "r") as f:
        numbers = list(map(lambda x: int(x) if x != "" else x ,f.read().split("\n")))

        running_total = 0
        max_sum = 0
        for value in numbers:
            if value == "":
                running_total = 0
            else:
                running_total += value
            max_sum = max(running_total, max_sum)
            
        max_sum = max(max_sum, running_total)
        print(max_sum)

def solution2():
    with open("./input.txt", "r") as f:
        numbers = list(map(lambda x: int(x) if x != "" else x ,f.read().split("\n")))

        running_total = 0
        totals = []
        for value in numbers:
            if value == "":
                totals.append(running_total)
                running_total = 0
            else:
                running_total += value

        if running_total != 0:
            totals.append(running_total)
        
        totals.sort()
            
        print(sum(totals[-3:]))

solution2()
