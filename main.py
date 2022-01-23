def getText(url):
    with open(file=url, mode="r",  encoding="utf-8") as txt:
        content = txt.read().split("\n")
        return content

def writeText(url, content):
    with open(file=url, mode="w",  encoding="utf-8") as txt:
        txt.write(content)

def start(url):
    data = getText(url)

    number = 0
    result = []

    while number < len(data):
        result.append(data[number] + "  \n")
        number += 1

    writeText(url=url, content="".join(result))

start(input("주소 입력 : "))