// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductMessageEntry _$ProductMessageEntryFromJson(Map<String, dynamic> json) => ProductMessageEntry(
  countryId: json['countryId'] as String?,
  key: json['key'] as String,
  origin: $enumDecode(_$ProductTextOriginEnumMap, json['origin']),
  status: $enumDecode(_$ProductMessageStatusEnumMap, json['status']),
  text: json['text'] as String,
);

Map<String, dynamic> _$ProductMessageEntryToJson(ProductMessageEntry instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'key': instance.key,
  'origin': _$ProductTextOriginEnumMap[instance.origin]!,
  'status': _$ProductMessageStatusEnumMap[instance.status]!,
  'text': instance.text,
};

const _$ProductTextOriginEnumMap = {
  ProductTextOrigin.human: 'human',
  ProductTextOrigin.machine: 'machine',
  ProductTextOrigin.original: 'original',
};

const _$ProductMessageStatusEnumMap = {
  ProductMessageStatus.draft: 'draft',
  ProductMessageStatus.published: 'published',
  ProductMessageStatus.reviewed: 'reviewed',
};
