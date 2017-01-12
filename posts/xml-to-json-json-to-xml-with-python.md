


#### #Install xmltodict

```
pip install xmltodict
```

#### #xml2json & json2xml

```
import xmltodict,json

xmlFile = open('a.xml','r')
xmlString = xmlFile.read()

objXml = xmltodict.parse(b)
objString = json.dumps(objXml,indent=4)
obj = json.loads(objString)

xml = xmltodict.unparse(obj, pretty=True)
```

#### #inputXml
```
<krpano version="1.18">
	
	<!-- the skin -->
	<include url="skin/defaultskin.xml" />
	
	<!-- view settings -->
	<view hlookat="0" vlookat="0" maxpixelzoom="1.0" fovmax="150" limitview="auto" />
	<preview url="a.tiles/preview.jpg" />
	<image type="CUBE" multires="true" tilesize="512">
		<level tiledimagewidth="768" tiledimageheight="768">
			<cube url="a.tiles/mres_%s/l1/%v/l1_%s_%v_%h.jpg" />
		</level>
		<mobile>
			<cube url="a.tiles/mobile_%s.jpg" />
		</mobile>
	</image>

</krpano>
```

#### # jsonString
```
{
    "krpano": {
        "@version": "1.18",
        "include": {
            "@url": "skin/defaultskin.xml"
        },
        "view": {
            "@hlookat": "0",
            "@vlookat": "0",
            "@maxpixelzoom": "1.0",
            "@fovmax": "150",
            "@limitview": "auto"
        },
        "preview": {
            "@url": "a.tiles/preview.jpg"
        },
        "image": {
            "@type": "CUBE",
            "@multires": "true",
            "@tilesize": "512",
            "level": {
                "@tiledimagewidth": "768",
                "@tiledimageheight": "768",
                "cube": {
                    "@url": "a.tiles/mres_%s/l1/%v/l1_%s_%v_%h.jpg"
                }
            },
            "mobile": {
                "cube": {
                    "@url": "a.tiles/mobile_%s.jpg"
                }
            }
        }
    }
}
```

#### #outputXml
```
<?xml version="1.0" encoding="utf-8"?>
<krpano version="1.18">
	<preview url="a.tiles/preview.jpg"></preview>
	<image multires="true" type="CUBE" tilesize="512">
		<mobile>
			<cube url="a.tiles/mobile_%s.jpg"></cube>
		</mobile>
		<level tiledimagewidth="768" tiledimageheight="768">
			<cube url="a.tiles/mres_%s/l1/%v/l1_%s_%v_%h.jpg"></cube>
		</level>
	</image>
	<include url="skin/defaultskin.xml"></include>
	<view limitview="auto" hlookat="0" vlookat="0" fovmax="150" maxpixelzoom="1.0"></view>
</krpano>
```
```