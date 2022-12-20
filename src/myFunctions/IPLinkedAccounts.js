import User from '../models/user';
import treeify from 'treeify';

let IPLinkedAccounts = async (username, num_levels) => {
  // console.log("Running ip linked accounts code");

  let linkedUsernames = [];
  let linkedUsernamesWithLevel = [];

  let usernamesTree = {};

  let IPsToVisit = [];
  let visitedIPs = [];

  // Track down each user account linked to all IPs.
  // Only need to return usernameLower and IPAddresses from the query
  const user = await User.findOne(
    { usernameLower: username.toLowerCase() },
    'usernameLower IPAddresses'
  );

  if (user) {
    linkedUsernames.push(user.usernameLower);
    linkedUsernamesWithLevel.push({
      username: user.usernameLower,
      level: 0,
    });
    usernamesTree[user.usernameLower] = {};
    let thisNode = usernamesTree[user.usernameLower];

    IPsToVisit = user.IPAddresses;
    IPsToVisit = IPsToVisit.map((x) => {
      return { ip: x, parent: thisNode };
    });
    IPsToVisit.push(null);
    let level = 1;

    while (IPsToVisit.length !== 0) {
      const nextIPObj = IPsToVisit.shift();
      // console.log(IPsToVisit);

      // Tracking the level number by inserting null.
      if (nextIPObj == null) {
        level++;
        IPsToVisit.push(null);
        if (IPsToVisit[0] === null || level === num_levels + 1) {
          // You are encountering two consecutive `nulls` means, you visited all the nodes.
          // or break if we've reached our target num levels
          break;
        } else {
          continue;
        }
      }

      const nextIP = nextIPObj.ip;
      thisNode = nextIPObj.parent;

      const linkedUsers = await User.find(
        { IPAddresses: nextIP },
        'usernameLower IPAddresses'
      );
      visitedIPs.push(nextIP);
      for (const u of linkedUsers) {
        // If this user hasn't been checked yet, add their username to the list and their IPs.
        if (!linkedUsernames.includes(u.usernameLower)) {
          linkedUsernames.push(u.usernameLower);
          linkedUsernamesWithLevel.push({
            username: u.usernameLower,
            level: level,
          });
          thisNode[u.usernameLower] = {};

          IPsToVisit = IPsToVisit.concat(
            u.IPAddresses.filter((x) => !visitedIPs.includes(x)) // Skip IP's that we have visited already.
              .map((x) => {
                return { ip: x, parent: thisNode[u.usernameLower] };
              })
          );
        }
      }
    }
    const returnObj = {
      linkedUsernames: linkedUsernames,
      linkedUsernamesWithLevel: linkedUsernamesWithLevel,
      linkedIPs: visitedIPs,
      target: username,
      usernamesTree: treeify.asTree(usernamesTree, true),
    };

    return returnObj;
  } else {
    throw new Error('Could not find user ' + username + '.');
  }
};

export default IPLinkedAccounts;
