// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commitment_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsCommitmentCollection _$PoliticsCommitmentCollectionFromJson(Map<String, dynamic> json) => PoliticsCommitmentCollection(
  commitments: (json['commitments'] as List<dynamic>).map((e) => PoliticsCommitmentEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$PoliticsCommitmentCollectionToJson(PoliticsCommitmentCollection instance) => <String, dynamic>{
  'commitments': instance.commitments,
};
