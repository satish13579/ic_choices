import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import RBTree "mo:base/RBTree";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";

actor {

    type Voting = {
        name : Text;
        title : Text;
        description : Text;
        votes : {
            s1 : [Principal];
            s2 : [Principal];
        };
        s1 : Text;
        s2 : Text;
        max_votes : Nat;
        createdAt : Time.Time;
    };

    stable var listings : [Voting] = [];

    public shared (msg) func addVoting(name : Text, title : Text, description : Text, s1 : Text, s2 : Text, max_votes : Nat) : async {
        statusCode : Nat;
        msg : Text;
    } {
        if (not Principal.isAnonymous(msg.caller)) {
            var newVoting : Voting = {
                name = name;
                title = title;
                description = description;
                votes = { s1 = []; s2 = [] };
                s1 = s1;
                s2 = s2;
                max_votes = max_votes;
                createdAt = Time.now();
            };
            var id = 1000 + Array.size<Voting>(listings);
            listings := Array.append<Voting>(listings, Array.make<Voting>(newVoting));
            return {
                statusCode = 200;
                msg = Nat.toText(id);
            };
        } else {
            return {
                statusCode = 404;
                msg = "Connect Wallet To Access this Functionality";
            };
        };
    };

    public shared query (msg) func getVoting(id : Nat) : async {
        statusCode : Nat;
        msg : Text;
        voting : ?Voting;
        caller : Principal;
    } {
        if (not Principal.isAnonymous(msg.caller)) {
            if(id < 1000){
                return {
                    statusCode = 400;
                    voting = null;
                    msg = "Invalid Id for Voting";
                    caller = msg.caller;
                };
            };
            var index : Nat = id - 1000;
            if (index < Array.size<Voting>(listings)) {
                var voting = Array.subArray<Voting>(listings, index, 1);
                return {
                    statusCode = 200;
                    voting = ?voting[0];
                    msg = "Retrieved Voting Successfully.";
                    caller = msg.caller;
                };
            } else {
                return {
                    statusCode = 400;
                    voting = null;
                    msg = "Invalid Id for Voting";
                    caller = msg.caller;
                };
            };
        } else {
            return {
                statusCode = 404;
                voting = null;
                msg = "Connect Wallet To Access this Functionality";
                caller = msg.caller;

            };
        };
    };

    public shared (msg) func vote(id : Nat, subject : Text) : async {
        statusCode : Nat;
        msg : Text;
    } {
        if (not Principal.isAnonymous(msg.caller)) {
            var index : Nat = id - 1000;
            if (index < Array.size<Voting>(listings)) {
                var voting = Array.subArray<Voting>(listings, index, 1);
                var votng = voting[0];
                var s1votes = votng.votes.s1;
                var noofs1votes = Array.size<Principal>(s1votes);
                var s2votes = votng.votes.s2;
                var noofs2votes = Array.size<Principal>(s2votes);
                var s1mapp = Array.filter<Principal>(s1votes, func x = x == msg.caller);
                var noofs1mapp = Array.size<Principal>(s1mapp);
                var s2mapp = Array.filter<Principal>(s2votes, func x = x == msg.caller);
                var noofs2mapp = Array.size<Principal>(s2mapp);
                if (noofs1mapp > 0 or noofs2mapp > 0) {
                    return {
                        statusCode = 400;
                        msg = "You Have Already Voted For this Voting.";
                    };
                };
                if (noofs1votes == votng.max_votes or noofs2votes == votng.max_votes) {
                    return {
                        statusCode = 400;
                        msg = "Voting Has Ended since one of the Subject Reached Maximum Votes.";
                    };
                };
                if (votng.s1 == subject) {
                    var news1votes = Array.append<Principal>(s1votes, Array.make<Principal>(msg.caller));
                    var newVoting = {
                        name = votng.name;
                        title = votng.title;
                        description = votng.description;
                        votes = { s1 = news1votes; s2 = votng.votes.s2 };
                        s1 = votng.s1;
                        s2 = votng.s2;
                        max_votes = votng.max_votes;
                        createdAt = votng.createdAt;
                    };
                    var array2 : [Voting] = Array.tabulate<Voting>(
                        Array.size<Voting>(listings),
                        func(i : Nat) : Voting {
                            if (i == index) { newVoting } else { listings[i] };
                        },
                    );
                    listings := array2;
                } else {
                    var news2votes = Array.append<Principal>(s2votes, Array.make<Principal>(msg.caller));
                    var newVoting = {
                        name = votng.name;
                        title = votng.title;
                        description = votng.description;
                        votes = { s1 = votng.votes.s1; s2 = news2votes };
                        s1 = votng.s1;
                        s2 = votng.s2;
                        max_votes = votng.max_votes;
                        createdAt = votng.createdAt;
                    };
                    var array2 : [Voting] = Array.tabulate<Voting>(
                        Array.size<Voting>(listings),
                        func(i : Nat) : Voting {
                            if (i == index) { newVoting } else { listings[i] };
                        },
                    );
                    listings := array2;
                };
                return {
                    statusCode = 200;
                    msg = "Voted Successfully.";
                };
            } else {
                return {
                    statusCode = 400;
                    msg = "Invalid Id for Voting";
                };
            };

        } else {
            return {
                statusCode = 404;
                msg = "Connect Wallet To Access this Functionality";
            };
        };
    };

};
