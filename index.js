const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const moment = require('moment')
const Hashids = require('hashids')

// vars
const DIR_POST = './_posts'

function convert(post) {
  const regx = new RegExp(/---(.|\n)*?---/)                                           // regx      
  const info = yaml.load(post.match(regx)[0].replace(/---/g, ''), { json: true })     // info    
  const markdown = post.replace(regx, '$1')                                           // markdown
  return { info, markdown }
}

function write(name, data) {
  fs.writeFileSync(
    name,
    typeof (data) === 'string'
      ? data
      : JSON.stringify(data, null, '  '),
    { encoding: 'utf8' }
  )
}

function storage(storage) {
  let _storage = storage || {}
  return {
    gets: () => {
      return _storage
    },
    save: (key, value) => {
      _storage[key]
        && _storage[key].push(value)
        || (_storage[key] = [value])
    }
  }
}

function build() {
  // read dir & get posts
  const posts = fs.readdirSync(DIR_POST)

  let _tags = storage()
  let _archives = storage()
  let _posts = []

  _posts = posts
    .filter(post => {
      return new RegExp(/.*(.md|.markdown)$/).test(post)
    })
    .map(post => {
      let file = fs.readFileSync(path.join(DIR_POST, post), 'utf-8')

      let { info, markdown } = convert(file)
      let name = './posts/' + info.title.toLocaleLowerCase() + '.md'

      let { title, date, tags } = info

      // archives
      let year = moment(date).year()
      _archives.save(year, title)

      // tags
      Array.isArray(tags)
        && tags.map(tag => {
          _tags.save(tag, title)
        })
        || _tags.save(tags, title)

      // write to dir
      write(name, markdown)

      // record to db
      return Object.assign({
        file: name
      }, info)
    })

  return {
    posts: _posts,
    tags: _tags.gets(),
    archives: _archives.gets()
  }
}


function generate() {
  function mkd(j) {
    // - l1
    //   - l2
    let str = ''
    for (l1 in j) {
      str += `- ${l1} \n`
      for (let l2 in j[l1]) {
        str += `  - [${j[l1][l2]}](posts/${j[l1][l2]}.md)\n`
      }
      str += '\n'
    }
    return str
  }

  let date = moment()
  let version = {
    date: date.toString(),
    version: new Hashids().encode(date.unix())
  }

  let db = build()
  let { tags, archives } = db

  let str = [
    '# Blog',
    'Blog . import post from hexo',
    '## tags',
    mkd(tags),
    '## archives',
    mkd(archives),
    `## version \n\`${JSON.stringify(version)}\``    
  ].join('\n')


  write('./json/db.json', db)
  write('./README.md', str)
}

generate()