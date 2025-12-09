Here is the transcript of the audio conversation.

**Speakers:**
*   **Andrew:** Project Lead/Manager (Main speaker explaining the mechanics)
*   **Eli:** UI/UX Designer or Frontend Dev
*   **Adrian:** Developer

***

**Andrew:** ...to a bunch of chains. And when you apply that to a bunch of chains, you receive CNPY and the native asset as a result. Meaning that for this Game chain, I will earn GAME (G-A-M-E) and I will earn CNPY for staking that.

**Eli:** Okay.

**Andrew:** Where the information is incomplete is that you can actually stake this GAME at the individual level on the Game chain. Not on the Canopy chain, but on the Game chain.

**Eli:** Okay.

**Andrew:** And that's where this multi-chain wallet is correct. Because you have this balance of GAME, and you're going to stake that on the Game chain, and that... you can stake any amount of the GAME you want, right? So it doesn't have to be the exact same amount as you had staked on CNPY. Importantly, if you already have a position of GAME, you cannot stake less. You can't remove some of your stake. You can only add more stake—which is top up. Once you have a position, you can unstake *all* of those tokens, but that usually takes about seven days to receive it back.

**Eli:** Okay.

**Andrew:** So, it's just to repeat myself here: You can stake CNPY for a bunch of different chains and earn the native token for those chains, and earn CNPY for staking that. Then, with those native tokens like GAME or on-chain BNB or whatever, you can stake those on those individual chains. And when you stake those on those individual chains, you can stake any amount you want. But once you have a staking position, you can only increase your amount or remove *all* of it in an unstake transaction.

**Eli:** Okay, yeah, that... that is clear.

**Andrew:** Okay.

**Eli:** I do have a question in terms of CNPY. Um, because... is... yeah, I mean, my fault, I didn't add that here, right? Um, but what would be basically the step-by-step process? How can we communicate [to] the user that they can stake CNPY and they will earn both CNPY and...

**Adrian:** Native tokens.

**Eli:** ...yeah.

**Andrew:** Yeah. So I think... I think it's just about being clear when they're doing the stake, right? I think pretty early on in the user experience, they're going to realize: "When I stake my CNPY, I will have an option." There will be like a list of chains that I can basically stake my tokens on behalf of those chains. And when you are doing that, you would be asking yourself: "Well, why would I stake for Game chain? Why would I stake CNPY for Stream Vault? Why would I stake CNPY for on-chain ENS or DeFi Masters or Social Connect?" And the answer is... is very clearly we need to tell the user: "Hey, when you stake CNPY for these tokens, you will earn that native token."

**Eli:** Mm-hm. But and also CNPY.

**Andrew:** And that's why you would ever stake... that's why you would ever stake for these chains. And that's the benefit. It's basically like... CNPY allows you to have exposure to all of these new chains which could be worth a lot more someday. That's the game, right?

**Eli:** Yeah. Yeah, that... that makes sense now. Is it that clear to you Adrian? Or...

**Adrian:** Yeah. I have some question because, you know that the... I mean, when you do a transaction at `editStake`, you could... you have to pass like the commodities you want to... I mean, for example, let's say I have 100 Canopy and I have delegated to the chain Number 1, for example. So, I should create a new stake for... I mean, do a transaction stake to build a new... new stake? Or I have to edit and add the chain ID to that existing stake?

**Andrew:** Yeah, it's just an `editStake`. Right. You're just adding the chain ID. And that's why you were partially right, Adrian, when you were saying, "Hey, it's just one number of tokens for every chain you stake." Which is correct in CNPY, right? You only have one CNPY balance, and you can apply that to, let's say, up to 15 chains, for example. Whatever the on-chain governance param limits you to, which currently I think is 15 chains, will probably move that to 100.

**Adrian:** Okay.

**Andrew:** However, by doing that, you're earning these like "baby tokens," and you can stake those tokens. And by... when you stake those tokens, you will earn that native token. And if it's a subsidized chain, you will actually earn CNPY as well.

**Adrian:** Mmm. Okay.

**Andrew:** So... it's kind of a circular system, right? Where it's like, "Hey, I can stake the game token [to] earn more game token. And if game token is worth enough, I will actually earn some CNPY for doing that too." But it's basically like... if you stake all of your tokens, you're going to maximize your opportunity.

**Adrian:** Okay. So let's say... let's see something. Give me a second. Oh, okay. So I'm looking for the RPC docs. So basically based on the chain ID, this will be the scope of that transaction, right? For example, if I pass through the params in the post... transaction... whatever... and I put the chain ID, I'm just saying to the blockchain, "Hey, I'm staking *this* amount for *this* chain ID." And this will be a separate stake transaction. If I, for example, I want to stake another chain, for example, Chain ID 2, but that will be another... another stake, right? I don't know if I claimed myself correctly.

**Andrew:** Uh, let me be clear. I may have confused you a little bit. You only have one CNPY stake. Let's say you, Adrian, have 1,000 CNPY and it's staked.

**Adrian:** Okay.

**Andrew:** And you're staked currently for Chain ID 1, which is CNPY, and you're staked for Chain ID 200, which is Game. Okay? Uh, if you wanted to add DeFi Masters to that stake, what you would do is execute an `editStake` and in the committees field you'd put Chain ID 1, Chain ID 200, and Chain ID 300—which is now the DeFi Masters. And now your 1,000 Canopy would be applied to all three chains. And you would be earning all three tokens by doing it.

**Eli:** I do have a question, Andrew, there.

**Adrian:** Okay. I got it.

**Eli:** Just to make sure, you know, we are aligned. Wondering... when someone stake CNPY, they will get the benefit that you just described, right? They can earn baby tokens. But, is that optional? Or mandatory? I mean, is that [an] optional thing to do? I mean if... if they want to stake CNPY and that's it... they can do that?

**Andrew:** That's exactly right. So, let's say you have 1,000 CNPY. What can you do with it? You can stake for Chain ID 1, which is just CNPY, which means you only earn CNPY.

**Eli:** Yeah.

**Andrew:** You also do not have to stake for CNPY. You can only stake for Game. And that only earns you Game, right?

**Eli:** Mm-hm.

**Andrew:** If you stake for both, you get both! And it doesn't cost you any more. It's not like you're earning less Game because you're staked for both CNPY and Game.

**Eli:** Mm-hm.

**Andrew:** So basically, you're going to want to stake for your top chains.

**Eli:** So, if I could make a recommendation guys, I think we need to change the "Claim" button to an "Unstake" button. Which allows you to remove your full stake amount.

**Adrian:** Mm-hm.

**Andrew:** I like the current earned balance, I think that's cool. Or you could say "Current staked balance" if you prefer. The annual yield makes a lot of sense. I think we need to add something to represent your Canopy stake, because that's going to be the main thing that people are staking with. And I think you need to be able to see on Canopy which chains the user is staked for. Because right now I can see my balances... I can see, "Oh, I have Game balance, I have Stream balance, I have On-chain ENS." But I don't know if I'm staking my Canopy on behalf of those, or if I just happen to have those balances because I did a token swap, or I just happen to have those balances because somebody sent them to me, right?

**Eli:** Yeah.

**Andrew:** I need to be able to see: "Hey, I currently have my Canopy staked for Game and Stream. And by the way, I can click a button and add a new chain that I want to stake for." Like if I want to stake Adrian Chain or Eli Chain, I can do that with one click. And I am able to start earning that baby token. And that's totally optional, I don't have to do that. But why not? Right? Like, I want to earn more tokens. I think Adrian Coin could go somewhere someday. I think Eli Token could be worth more someday. So I want to earn them now while they're babies, and then eventually I can sell those tokens, right? And as I earn those tokens, I want to be able to stake those tokens on the Eli Chain and the Adrian Chain respectively—which is what you have here. You have the ability to stake the actual Game token and stake the Stream Vault token and stake the ENS token... that will earn you more of those tokens, so you're optimizing your yield. But the most important thing, which is "Where is my Canopy staked?" is not represented here as far as I know.

**Eli:** Mm-hm. Yeah, exactly. Yeah, that's my fault. Um...

**Andrew:** No, no, not at all. Like you said, the PRD is not as clear as it should have been. So I apologize about that.

**Eli:** No, no worries man. We are all on this.

**Andrew:** Yeah, of course.

**Eli:** Well perfect. I mean that's... that's now clear... crystal clear to me.

**Andrew:** Okay.

**Adrian:** Yeah, sounds good. Yeah.

**Andrew:** And I think...

**Adrian:** Uh-huh? Sorry?

**Andrew:** Well I was going to say is, listen, let's just try to get a first version up that has like most... 80% of it there. And then we can iterate, right? It doesn't have to be perfect from... like if we're missing some details or something changed. But I think you guys get the general flow. I think everyone should have at least 80% knowledge now of what's going on.

**Adrian:** Yeah. The only thing I'm missing like to finish like the entire model is like to do `editStake` because I didn't know how the entire flow in the Super App... I was like a little confused. I have to... "Hey let me clarify with Eli and with you Andrew." And now it's more clear now. So probably I have to solve... probably depends on the design that Eli's going to implement now. I have to talk with Eric and see if the design fits with the backend data and finish this section that is missing right now. So yeah, we are like in the 80%. For sure.

**Andrew:** Totally get it. Totally get it. No worries at all. Um, let me know guys if you ever have a question or you're unsure. I'm happy to hop on a call. I'm almost always available. Uh, so no worries at all if things are still not clear, I'm happy to answer questions.

**Adrian:** Great. Um, I don't know if you, Andrew, want that I deploy like the current progress that I have...