/// Everything the app covers, as the Explore tab lists it: a title, what you will find there and where it opens.
/// One typed list in one place. The sentences go through the translator (`t`), so each has Swahili in strings.dart.
typedef ExploreEntry = ({
  String id,
  String title,
  String body,
  List<String> finds,
  String icon,
  String path,
});

const exploreCatalog = <ExploreEntry>[
  (
    id: 'places',
    title: 'Places',
    body:
        'Start at the counties and narrow down to a constituency, ward or town.',
    finds: ['Counties', 'Wards', 'Maps'],
    icon: 'pin',
    path: '/browse',
  ),
  (
    id: 'stats',
    title: 'Population & statistics',
    body:
        'How many people live where, how crowded it is and how it has changed.',
    finds: ['Census', 'Density', 'Trends'],
    icon: 'chart',
    path: '/stats',
  ),
  (
    id: 'leaders',
    title: 'Leaders',
    body:
        'Who holds each seat, from the president down to the ward, and how they got there.',
    finds: ['Elected', 'Appointed', 'Nominated'],
    icon: 'tree',
    path: '/leaders',
  ),
  (
    id: 'institutions',
    title: 'Institutions',
    body: 'The bodies that run the country, what each is for and who leads it.',
    finds: ['Parliament', 'Judiciary', 'Commissions'],
    icon: 'parliament',
    path: '/institutions',
  ),
  (
    id: 'constitution',
    title: 'The Constitution',
    body:
        'Read the rules that create offices and bodies, and see what they explain.',
    finds: ['Chapters', 'Acts', 'Bills'],
    icon: 'book',
    path: '/constitution',
  ),
  (
    id: 'elections',
    title: 'Elections',
    body: 'Results by year and by place, turnout and who won.',
    finds: ['2013', '2017', '2022'],
    icon: 'vote',
    path: '/elections',
  ),
  (
    id: 'parliament',
    title: 'Parliament & votes',
    body: 'Bills and motions, how each member voted and what they said.',
    finds: ['Divisions', 'Speeches', 'Attendance'],
    icon: 'parliament',
    path: '/parliament',
  ),
  (
    id: 'civic',
    title: 'Money & projects',
    body:
        'Public projects on a map, development funds and whether they were finished.',
    finds: ['Projects', 'Funds', 'Map'],
    icon: 'build',
    path: '/civic',
  ),
  (
    id: 'tenders',
    title: 'Tenders',
    body: 'What government is buying, who bid and who won.',
    finds: ['Open', 'Awarded', 'Contracts'],
    icon: 'document',
    path: '/tenders',
  ),
  (
    id: 'parties',
    title: 'Parties',
    body: 'Registered political parties, their members and their funding.',
    finds: ['Members', 'Funding', 'Seats'],
    icon: 'flag',
    path: '/parties',
  ),
  (
    id: 'sources',
    title: 'Sources & evidence',
    body: 'Where every figure comes from, so you can check it yourself.',
    finds: ['Citations', 'Publishers', 'Documents'],
    icon: 'document',
    path: '/source-browse',
  ),
  (
    id: 'facts',
    title: 'Did you know?',
    body: 'Short facts about Kenya and the place you are in.',
    finds: ['Facts', 'By region'],
    icon: 'sparkle',
    path: '/facts',
  ),
];
