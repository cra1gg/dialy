f = open("3to9 chars unfiltered.txt", "r")
all_words = f.readlines()
swears = open("cursewords.txt", "r")
all_swears = swears.readlines()

for i in range(len(all_words)):
    all_words[i] = all_words[i].rstrip("\n")

for i in range(len(all_swears)):
    all_swears[i] = all_swears[i].rstrip("\n")

for swear_word in all_swears:
    if swear_word in all_words:
        print(swear_word + " is in list")
        all_words.remove(swear_word)

for i in range(len(all_words)):
    all_words[i] = all_words[i] + "\n"
output = open("output.txt", "w")
output.writelines(all_words)