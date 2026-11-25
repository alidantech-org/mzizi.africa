// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_screen.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendPlaceScreen _$FrontendPlaceScreenFromJson(Map<String, dynamic> json) => FrontendPlaceScreen(
  articles: (json['articles'] as List<dynamic>).map((e) => FrontendArticleLink.fromJson(e as Map<String, dynamic>)).toList(),
  breadcrumb: (json['breadcrumb'] as List<dynamic>).map((e) => FrontendPlaceLink.fromJson(e as Map<String, dynamic>)).toList(),
  children: (json['children'] as List<dynamic>).map((e) => FrontendPlaceLink.fromJson(e as Map<String, dynamic>)).toList(),
  country: FrontendCountryLink.fromJson(json['country'] as Map<String, dynamic>),
  events: (json['events'] as List<dynamic>).map((e) => FrontendEventLink.fromJson(e as Map<String, dynamic>)).toList(),
  figures: (json['figures'] as List<dynamic>).map((e) => FrontendFigure.fromJson(e as Map<String, dynamic>)).toList(),
  language: json['language'] as String,
  languages: (json['languages'] as List<dynamic>).map((e) => FrontendLanguageOption.fromJson(e as Map<String, dynamic>)).toList(),
  leaders: (json['leaders'] as List<dynamic>).map((e) => FrontendLeader.fromJson(e as Map<String, dynamic>)).toList(),
  place: FrontendPlaceLink.fromJson(json['place'] as Map<String, dynamic>),
  projects: (json['projects'] as List<dynamic>).map((e) => FrontendProjectLink.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FrontendPlaceScreenToJson(FrontendPlaceScreen instance) => <String, dynamic>{
  'articles': instance.articles,
  'breadcrumb': instance.breadcrumb,
  'children': instance.children,
  'country': instance.country,
  'events': instance.events,
  'figures': instance.figures,
  'language': instance.language,
  'languages': instance.languages,
  'leaders': instance.leaders,
  'place': instance.place,
  'projects': instance.projects,
};
