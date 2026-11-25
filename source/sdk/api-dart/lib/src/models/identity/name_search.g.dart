// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'name_search.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityNameSearch _$IdentityNameSearchFromJson(Map<String, dynamic> json) =>
    IdentityNameSearch(limit: (json['limit'] as num?)?.toInt(), offset: (json['offset'] as num?)?.toInt(), text: json['text'] as String);

Map<String, dynamic> _$IdentityNameSearchToJson(IdentityNameSearch instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'text': instance.text,
};
