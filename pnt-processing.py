import json

#Open Json file:
with open('GooseCount1.pnt', 'r') as f:

    #Formatting data as dictionary
    values = json.load(f)

#Print dictionary
for image_name, class_dict in values['points'].items():
    with open(f'{image_name[:-4]}.JSON', 'w') as f:
        class_dict['Goose_count'] = len(class_dict['Goose'])
        class_dict['Other_count'] = len(class_dict.get('Other','')) + len(class_dict.get('Duck',''))
        f.write(json.dumps(class_dict))





    

