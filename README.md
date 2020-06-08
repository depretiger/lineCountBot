# LINEで文字数をカウントしてくれるだけのともだちをつくる

## ともだち召喚の背景

６月になり、各企業さんが夏季インターンの募集を初めています。私も今年からインターンに参加しようと思っていますが、ES作成がとっても不安な私は先輩にESの添削をお願いしました。

LINEで先輩に文章を送って見てもらうのですが、困ったことがありました。ESにはだいたい文字数制限があるのです。（しかもギリギリまで書くのが推奨されているらしい）

制限文字数ちょうどで書いた文章を添削してもらうとき、先輩に直された文章が文字数を超過していたらいたたまれない気持ちになります。もうちょっと減らしてもらえますか？なんて言えたもんじゃないです。

また、文字数を数えること自体もそれはそれで面倒です。ESの形式によっては数えてくれるものもありますが、大抵私はWordに貼り付けて文字数をかぞえていました。面倒です。

そこで、カウント係の友達をもう一人トークに招待し、文章の文字数を数えてもらうことを思いつきました。が、そんな都合のいい友達はいません。よって、LineBOTを召喚します。

## 環境

せっかくなので、研究に必要で勉強している最中のNode.jsを使ってみることにします。Herokuを使えばlineBotを簡単に作れそうです。

- Heroku
- Node.js

## 参考

[LINE BOTをHeroku + Node.jsでやるまで](https://qiita.com/TakuTaku04/items/cb71f10669a9e9cbf71b)

超分かり易かったです。手順に従って簡単にLINEBOTを作成できました。ありがとうございます。

## lineBot()

/hook を呼び出すとこの関数を呼ぶようにする。

```javascript
function lineBot(req, res) {
        res.status(200).end();
        const events = req.body.events;
        const promises = [];
        for (let i = 0, l = events.length; i < l; i++) {
            const ev = events[i];
            promises.push(
                kazoerukun(ev)
            )
        }
    }
```

## kazoerukun()

### テキストを取得して文字数を返すだけ

```javascript
async function kazoerukun(ev) {
        return client.replyMessage(ev.replyToken, {
            type: 'text',
            text: `${ev.message.text.length}もじ`
        })
    }
```



## オンオフ切り替えられるようにする

ずっとカウントしてくると、いちいち文字数を返してくるかぞえるくんにイライラします。

状態を保存する変数を用意して、切り替えられるようにします。