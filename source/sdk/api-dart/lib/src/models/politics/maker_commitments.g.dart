// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'maker_commitments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsMakerCommitments _$PoliticsMakerCommitmentsFromJson(Map<String, dynamic> json) => PoliticsMakerCommitments(
  limit: (json['limit'] as num?)?.toInt(),
  makerId: json['makerId'] as String,
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$PoliticsMakerCommitmentsToJson(PoliticsMakerCommitments instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'makerId': instance.makerId,
  'offset': ?instance.offset,
};
