import {shuffle} from 'lodash-es';

type Mention = {
  name: string;
  staffRecord: {
    juxtcode: string;
  };
};

const MENTION_SUGGESTIONS: Mention[] = shuffle([
  {
    id: 'https://home.juxt.site/home/people/011e4ca4-cc5d-4c04-908f-044de6532fff',
    name: 'Anders Pyfl',
    staffRecord: {
      juxtcode: 'arp',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/b4914777-51b7-4f89-ab12-0f0141fafa42',
    name: 'Will Cole-Jordan',
    staffRecord: {
      juxtcode: 'wcj',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/08534d9a-264a-47e1-b1ac-d2359e872627',
    name: 'Fraser Crossman',
    staffRecord: {
      juxtcode: 'fwc',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5f561131-acc7-4264-a8c2-7b4eb2c29285',
    name: "Connor O'Rourke",
    staffRecord: {
      juxtcode: 'cor',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5f195837-e901-4d26-9e02-e0db6d2a1926',
    name: 'Steve Harris',
    staffRecord: {
      juxtcode: 'sdh',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/61938ade-b657-427a-af9e-9e7df1b1820f',
    name: 'Tara El Kashef',
    staffRecord: {
      juxtcode: 'tek',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/1d0d424b-1e94-4878-9be2-d64c44f818c5',
    name: 'Dominic Monroe',
    staffRecord: {
      juxtcode: 'dmc',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/7f8503eb-ba07-4939-8e39-8b53a581d845',
    name: 'Matthew Butler-Williams',
    staffRecord: {
      juxtcode: 'mat',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/6036b355-566d-4e24-b5e4-a1c11d8e3a6b',
    name: 'Kathryn McAllister',
    staffRecord: {
      juxtcode: 'kat',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/7eab8dc0-8aba-4e85-bf8d-98ea7c1666ef',
    name: 'Marco Furone',
    staffRecord: {
      juxtcode: 'mar',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5b310cf8-d56b-42bc-af89-d0f08f40001b',
    name: 'Johanna Antonelli',
    staffRecord: {
      juxtcode: 'joa',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/1fd97c8d-c37c-4d14-ae48-0f45b94672f4',
    name: 'Mark Woodhall',
    staffRecord: {
      juxtcode: 'mrk',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5cdbef2c-15c5-46f3-827d-42cfb71c9754',
    name: 'Zyxmn Daley Jes',
    staffRecord: {
      juxtcode: 'zyx',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5d4809d9-2399-4da3-8168-f339aa2b0924',
    name: 'Daniel Mason',
    staffRecord: {
      juxtcode: 'dan',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/60014770-b714-4b5c-bc01-d727d36b6d9f',
    name: 'Tim Greene',
    staffRecord: {
      juxtcode: 'tim',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/c80c9a1d-ce0a-4f02-8e9e-31abb80d2e9f',
    name: 'Yufei Xie',
    staffRecord: {
      juxtcode: 'yfx',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/c36010fc-2d1f-416b-9b91-3dfb9c1a4fce',
    name: 'Kath Read',
    staffRecord: {
      juxtcode: 'kth',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/b5ff5af7-1cb0-4d4e-8435-dbf5517085d0',
    name: 'Malcolm Sparks',
    staffRecord: {
      juxtcode: 'mal',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/603e042f-ffe9-4d5f-b198-f8ad5f77443b',
    name: 'Jack Tolley',
    staffRecord: {
      juxtcode: 'jck',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/e1a7992c-82c1-4ba9-9f01-a8ef13c0b6a4',
    name: 'Patrik Kårlin',
    staffRecord: {
      juxtcode: 'pat',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/1c4e3516-3847-462c-9641-47c8d4e7faf0',
    name: 'Yury Rojas',
    staffRecord: {
      juxtcode: 'yry',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5d1a0978-4b03-4701-b88a-c393863b0be3',
    name: 'Jason Paterson',
    staffRecord: {
      juxtcode: 'jsn',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5f3bc8b4-6c2f-46b3-8dfd-6efa88e71fc9',
    name: 'Peter Baker',
    staffRecord: {
      juxtcode: 'pbk',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5c52d95a-136b-4e2c-8224-72c369cf7a15',
    name: 'Jeremy Taylor',
    staffRecord: {
      juxtcode: 'jdt',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5dbacc91-43e2-47b3-bb99-8b24df0eee0c',
    name: 'Mike Bruce',
    staffRecord: {
      juxtcode: 'mic',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/60f5f6c6-7990-4743-9786-9b2e786876e4',
    name: 'Renzo Borgatti',
    staffRecord: {
      juxtcode: 'ren',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/613744a5-edd5-436d-8cc6-d778205ef600',
    name: 'Eirini Chatzidaki',
    staffRecord: {
      juxtcode: 'eix',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/ecf6f85c-b48a-4fa1-bfcb-0c10de8db11c',
    name: 'Ovidiu Beldie',
    staffRecord: {
      juxtcode: 'ovi',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5ec5a42c-cbe2-45b0-9270-e87f6594a285',
    name: 'Carlos del Ojo',
    staffRecord: {
      juxtcode: 'coe',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/149ce2b6-9559-4ab7-9f2f-1aa710d80782',
    name: 'David Emery',
    staffRecord: {
      juxtcode: 'dem',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/18b108e2-92b7-4a0c-b511-ba568532040f',
    name: 'Finn Völkel',
    staffRecord: {
      juxtcode: 'fin',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/f3d43f40-d91d-4a8a-9d7c-1dc1de16253d',
    name: 'Jamie Franklin',
    staffRecord: {
      juxtcode: 'jfr',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/d497ec53-75dc-4441-a67d-fcbe2cef022e',
    name: 'Andrew Jackson',
    staffRecord: {
      juxtcode: 'and',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5fc4c08d-3c6c-46eb-8adb-83cb709730f6',
    name: 'Asel Kitulagoda',
    staffRecord: {
      juxtcode: 'asl',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/612e39a2-36ab-4b20-99cb-e670472c3221',
    name: 'Syed Fathir',
    staffRecord: {
      juxtcode: 'saf',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/29bed11b-1fbd-46fe-9206-cf804a9feef1',
    name: 'Andrew Baxter',
    staffRecord: {
      juxtcode: 'abx',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/616eea5c-2523-47af-beab-ad1529905ed7',
    name: 'Julie Dang',
    staffRecord: {
      juxtcode: 'jdg',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/b4b73b3a-9fe1-4a86-ab87-edfbff98bef2',
    name: 'Hugo Jacob',
    staffRecord: {
      juxtcode: 'hug',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5b8d045f-db3a-4d31-a6e7-ead6fe990979',
    name: "Lucio D'Alessandro",
    staffRecord: {
      juxtcode: 'lda',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/60c24703-9f05-4f42-8dcc-6dde9f054a15',
    name: 'Timas Saltanavicius',
    staffRecord: {
      juxtcode: 'tms',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/6093ead5-ccf0-453f-a233-c30624d7cf50',
    name: 'Andrea Pavan',
    staffRecord: {
      juxtcode: 'anp',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/9dabe22f-bdc3-45ce-8b48-0fa168acb5af',
    name: 'Graham Clark',
    staffRecord: {
      juxtcode: 'gtc',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/2bf11013-076c-4742-b969-588b81851734',
    name: 'Sarah Richardson-Kean',
    staffRecord: {
      juxtcode: 'srk',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/59e47083-c60e-4cc4-bd82-9733d065bb20',
    name: 'Alex Davis',
    staffRecord: {
      juxtcode: 'alx',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/bace31b1-c7da-48c7-abb2-b10e7537b900',
    name: 'Mark McElroy',
    staffRecord: {
      juxtcode: 'mkm',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/19dece23-cb8f-4613-9449-4b04ed3b6e40',
    name: 'Catharine Channing',
    staffRecord: {
      juxtcode: 'cth',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/2d2fe36d-064c-4a39-94ed-73dba30e8dd4',
    name: 'Tom Dalziel',
    staffRecord: {
      juxtcode: 'tom',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/618a4dd1-3b55-46e0-931a-fe33fd8e5b06',
    name: 'William Caine',
    staffRecord: {
      juxtcode: 'wac',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5da5ea4b-fb6e-4009-b689-c48cb305fa6f',
    name: 'James Henderson',
    staffRecord: {
      juxtcode: 'jms',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/79ee328d-4665-474c-a07e-f3efb177ef1f',
    name: 'Thomas Taylor',
    staffRecord: {
      juxtcode: 'tmt',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbf7b95-c991-45b1-84b4-38373dc463ab',
    name: "Alistair O'Neill",
    staffRecord: {
      juxtcode: 'aon',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/607a9d8b-d00d-40a8-a373-b00e2fd86ebe',
    name: 'James Simpson',
    staffRecord: {
      juxtcode: 'jss',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/6e88e787-ec63-404c-93ea-96df2d7b7413',
    name: 'Yury Zaytsev',
    staffRecord: {
      juxtcode: 'yry',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/60daf2e3-b675-434c-a93e-7b316cde1107',
    name: 'Werner Kok',
    staffRecord: {
      juxtcode: 'wrk',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/608ab01e-8183-418b-8d19-9bf85f6d29d1',
    name: 'Joe Littlejohn',
    staffRecord: {
      juxtcode: 'joe',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/75152717-369f-4c9a-8521-18d7590a0bbe',
    name: 'Ben Latchford',
    staffRecord: {
      juxtcode: 'bnl',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5ffe9da9-ff70-44a6-8f3e-24c33fcebe71',
    name: 'Max Grant-Walker',
    staffRecord: {
      juxtcode: 'max',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/619635c5-6e15-46e5-8534-a542f91ee699',
    name: 'Ashwin Prasanna',
    staffRecord: {
      juxtcode: 'apr',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbf7d29-e2eb-44bb-a06e-18a878668db3',
    name: 'John Mone',
    staffRecord: {
      juxtcode: 'jmo',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/e1aff319-1a82-48f2-9a76-ef53cda61698',
    name: 'Caroline Appleby',
    staffRecord: {
      juxtcode: 'cla',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbe24cb-2c24-4d5d-a024-8cede460980e',
    name: 'Matt Ford',
    staffRecord: {
      juxtcode: 'mtf',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5021cd02-ce46-41b1-afd3-9fa39b5bb920',
    name: 'Remy Rojas',
    staffRecord: {
      juxtcode: 'rro',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5e8b8cd2-0166-427d-9f37-81cc6bda332e',
    name: 'Hugo Young',
    staffRecord: {
      juxtcode: 'hjy',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/5f4f73bf-1330-4642-989a-107d2037ec3b',
    name: 'Andrea Crotti',
    staffRecord: {
      juxtcode: 'anc',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/2d8ced05-12c7-4603-b263-b80f2b7bd958',
    name: 'Jon Pither',
    staffRecord: {
      juxtcode: 'jon',
    },
  },
  {
    id: 'https://home.juxt.site/home/people/467eabea-e059-4cbd-bb0c-4b19c2c072c6',
    name: 'Ben Gerard',
    staffRecord: {
      juxtcode: 'bng',
    },
  },
]);

export {MENTION_SUGGESTIONS};

export type {Mention};
