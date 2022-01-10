const Instagram = require('instagram-web-api')
const bodyParser = require('body-parser')

function getArraysIntersection(arr1,arr2){
    return  arr1.filter(item1 => arr2.some(item2 => item1.id === item2.id));
}

function getArraysSubrection(myArray,toRemove){
    return  myArray.filter(ar => !toRemove.find(rm => (rm.id === ar.id) ))
}

var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/" + "page.html")
})

app.post('/', async (req, res) =>{
    const username = req.body.username
    const password = req.body.password
    const client = new Instagram({ username, password })
    try {
        await client.login()
        const inst = await client.getUserByUsername({ username: client.credentials.username })
        const followers = await client.getFollowers({ userId: inst.id, first: inst.edge_followed_by.count })
        const folloing = await client.getFollowings({ userId: inst.id, first: inst.edge_follow.count })
        var intersectinguser = getArraysIntersection(followers.data, folloing.data);
        var intersectinguser = getArraysSubrection(folloing.data, intersectinguser);
        var ans = [];
        ans.push({size: intersectinguser.length})
        intersectinguser.forEach(user => {
            ans.push({full_name : user.full_name, username : user.username, profile_pic_url: user.profile_pic_url});
        });
        res.send(ans)
        // await client.logout()
    }catch (err) {
        res.send('Error');
        console.log(err);
    }
})

app.listen(process.env.PORT || 8081,() => {
    console.log("localhost::8081")
})
