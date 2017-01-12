const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const moment = require('moment')
const Hashids = require('hashids')

var blog_posts = []
var blog_tags = {}
var blog_archives = {}


function convert(post) {

  // split yaml & markdown
  const regx = new RegExp(/---(.|\n)*?---/)

  // yml
  const yml_string = post.match(regx)[0].replace(/---/g, '')
  const info = yaml.load(yml_string, { json: true })

  // markdown
  const markdown = post.replace(regx, '$1')

  return {
    info: info,
    markdown: markdown
  }
}


function record(info) {

  // [
  //   // title | 
  //   'b:p:title',
  //     title
  //   // tags | set
  //   'b:t:tag',
  //     tag: [
  //       title
  //     ]  
  //   // archive | set
  //   'b:a:year'
  //     2015: [
  //       title
  //     ]
  // ]

  const title = info.title
  const tags = info.tags
  const date = moment(info.date).year()
  const types = [tags, date]
  const storages = [blog_tags, blog_archives]

  function store(key, value, storage) {
    // String
    if (storage[key]) {
      storage[key].push(value)
    } else {
      storage[key] = [value]
    }
  }

  blog_posts.push(title)

  types.map(_types => {
    const storage = storages[types.indexOf(_types)]

    // tags
    if (Array.isArray(_types)) {
      // Array
      _types.map(_type => {
        store(_type, title, storage)
      })
    } else {
      store(_types, title, storage)
    }
  })
}


function save(name, data) {
  if(typeof(data) === 'string'){
    fs.writeFileSync(name, data, { encoding: 'utf8' })
  }else{
    fs.writeFileSync(name, JSON.stringify(data, null, '  '), { encoding: 'utf8' })
  }
  
}


function generate() {

  const DIR = '/Users/thonatos/workspace/thonatos/blog.thonatos.com/source/_posts'
  const posts = fs.readdirSync(DIR)
  const posts_size = posts.length

  posts.map((post, index) => {    
    const regx = new RegExp(/.*(.md|.markdown)$/)
    let percent = Math.ceil((index + 1) / posts_size * 100)        
    
    console.log(`Completed: ${percent}%, Dealing: ` + post +' \r')
    
    if (regx.test(post)) {
      let tmp = fs.readFileSync(path.join(DIR, post), 'utf-8')
      let post_json = convert(tmp)
      save('./posts/' + post.toLocaleLowerCase(), post_json.markdown)      
      record(post_json.info)      
    }
  })

  save('./json/tags.json', blog_tags)
  save('./json/archives.json', blog_archives)
  save('./json/posts.json', blog_posts)

  // add version  
  // const hashids = new Hashids()
  // const date = moment()
  // save('./version.json', {
  //   date: date.toString(),
  //   version: hashids.encode(date.unix())
  // })  
  
}


generate()

function readme(){

  function t(j){
    let str = ''
    for(l1 in j){
      str += `- ${l1} \n`
      for (let l2 in j[l1]) {
        str += `  - [${j[l1][l2]}](posts/${j[l1][l2]}.md) \n`
      }
    }
    return str + '\n'
  }

  var str = `
# Blog

Blog . import post from hexo

` + 
 
`## tags

` + t(blog_tags) + 

`## archives

` + t(blog_archives)

  return str

}

save('./README.md', readme())
