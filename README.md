# What's this for?

Imagine you are consuming some JSON (via Ajax/XHR) from your favourite site and you have an endpoint but you **have to know if the content has changed** from the last time you retrieve it.

You can do it manually, of course. If we can automate this kind of things , you can save time to do other things :-)

> Don't expect rocket science here. It's just a little script

# Requirements

Be sure you have installed *NodeJs* v8.4.0 or above in your machine.

> It's better if you have a node version manager installed in your computer. My favourite is [NVM](https://github.com/creationix/nvm) . Kudos to [@creationix](https://github.com/creationix)

# Installation Notes

Just

```bash
git clone https://github.com/ntkog/xhr_watcher.git
cd xhr_watcher
npm install
```

# Usage

```bash
node index.js 'http://yoursiteyouwanttowhatch'
```
