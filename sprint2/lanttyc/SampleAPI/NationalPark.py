#Resource use
#https://www.nps.gov/subjects/developer/get-started.htm

import requests
import json

#Your API key here:
api_key = '01ncz1WTTwYceqQmHi3yypvDycyqYg7Kd8LJRCnO'
state = 'SC'

#url provide in API documentation
url = f'https://developer.nps.gov/api/v1/parks?stateCode={state}&api_key={api_key}'

response = requests.get(url)
list_of_park = json.loads(response.text)

#The national park in the location
for park in list_of_park['data']:
    print('Park Name:', park['fullName'])
    print('Location:', park['states'])
    print('Description:', park['description'])
    # Check if 'acres' key exists in park dictionary
    # This was an error I had
    if 'acres' in park:
        print('Size:', park['acres'], 'acres')
    else:
        print('Size: Unknown')
    
    print('Website:', park['url'])
    print('----------------------------------------')

