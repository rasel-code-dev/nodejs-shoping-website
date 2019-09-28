

module.exports = (user)=>{
  if(user === undefined){
    return undefined
  }

  let shortName;
  let nameArray = user.username.split(' ')

  let firstLetter = nameArray[0].slice(0, 1)

  //. when User Name 1 Word.........
  if(nameArray.length === 1){
    shortName = firstLetter
  } else {
    let lastLetter = nameArray[nameArray.length - 1].slice(0, 1)
    shortName = firstLetter + lastLetter
  }

  return shortName
}
