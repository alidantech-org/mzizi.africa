// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityLanguageList _$LocalityLanguageListFromJson(Map<String, dynamic> json) => LocalityLanguageList(
  languages: (json['languages'] as List<dynamic>).map((e) => LocalityLanguageChoice.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LocalityLanguageListToJson(LocalityLanguageList instance) => <String, dynamic>{'languages': instance.languages};
