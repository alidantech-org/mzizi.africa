// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home_screen.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendHomeScreen _$FrontendHomeScreenFromJson(Map<String, dynamic> json) => FrontendHomeScreen(
  countries: (json['countries'] as List<dynamic>).map((e) => FrontendCountryLink.fromJson(e as Map<String, dynamic>)).toList(),
  language: json['language'] as String,
  languages: (json['languages'] as List<dynamic>).map((e) => FrontendLanguageOption.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FrontendHomeScreenToJson(FrontendHomeScreen instance) => <String, dynamic>{
  'countries': instance.countries,
  'language': instance.language,
  'languages': instance.languages,
};
