# Querying Data from Databases

### Connect your mongoclient to your desired database using your connection string:
```
client = MongoClient("connection string")
```

### Create a database instance:
```
<database_instance> = client.<name_of_database>
```

### Opening a file to add:
* To add a file from your local computer:
    Use "with open" open the file using the location of the file from from your computer 
    ```
    with open("C:\\path\\to\\desired\\file.example",  'r') as f:
        data = json.load(f)
    ```

* To add a file from a storage account: 
    use urllib to request the url of your storage account at the file name
    ```
    with urllib.request.urlopen(<STORAGEACCOUNTURL> + <CONTAINERNAME> + "/" + <file_name>) as url:
                    file_data = json.loads(url.read().decode())
    ```

### Create a list of your data:
example:
```
list_of_dicts = [file_data]
```
    
### Adding a document to your collection:
```
<database_instance>.<name_of_collection>.insertMany(list_of_dicts)
```
to add a new document of data to the specific collection. 

### To remove a collection:
use .drop() method to remove that specific collection from the database
```
<database_instance>.<name_of_collection>.drop()
``` 
    
### To find a value in a collection:
```
val = <database_instance>.<name_of_collection>.find("<Key>": {<value>})
```

### To add a key and value to a collection:
```
<database_instance>.<name_of_collection>.insertOne({"<Key>": "<Value>"})
```
    
### To remove a key and value in a collection: 
```
<database_instance>.<name_of_collection>.remove({"<Key>": "<Value>"})
```


