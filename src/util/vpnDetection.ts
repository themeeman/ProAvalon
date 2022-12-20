import { RequestHandler } from 'express';

let whitelistedUsernames: string[] = [];
if (process.env.WHITELISTED_VPN_USERNAMES) {
  whitelistedUsernames = process.env.WHITELISTED_VPN_USERNAMES.split(',');
}

const isVPN = async (ip: string): Promise<boolean> => {
  return false;
  // const response = await fetch(
  //   `https://whois.as207111.net/api/lookup?ip_address=${ip}`,
  //   {
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${process.env.VPN_DETECTION_TOKEN}`,
  //     },
  //   }
  // );

  // const data = await response.json();

  // if (!data.privacy) {
  //   console.log(ip);
  //   console.log(data);
  //   throw new Error(
  //     'VPN Detection lookup response did not contain the expected data.'
  //   );
  // }

  // return data.privacy.proxy || data.privacy.hosting;
};

export const disallowVPNs: RequestHandler = (req, res, next) => {
  if (process.env.ENV === 'local') {
    next();
    return;
  }

  if (whitelistedUsernames.indexOf(req.body.username.toLowerCase()) !== -1) {
    next();
    return;
  }

  let clientIpAddress = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress) as string;

  if (Array.isArray(clientIpAddress)) {
    clientIpAddress = clientIpAddress[0];
  }

  isVPN(clientIpAddress)
    .then((vpn) => {
      if (vpn) {
        console.log(`Blocked ${req.body.username} on ip ${clientIpAddress}`);

        // @ts-ignore
        req.flash('error', 'VPNs are not allowed.');
        res.redirect('/');
        return;
      }

      next();
    })
    .catch((err) => {
      next();
      throw err;
    });
};
