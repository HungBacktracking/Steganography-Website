def detect_prefix(data):
    index_of_comma = data.find(',')
    if index_of_comma != -1:
        prefix = data[:index_of_comma+1]
        new_data = data[index_of_comma + 1:]
    else:
        prefix = ""
        new_data = data

    return prefix, new_data