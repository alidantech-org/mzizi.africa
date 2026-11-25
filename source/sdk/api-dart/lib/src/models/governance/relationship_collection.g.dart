// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationship_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceRelationshipCollection _$GovernanceRelationshipCollectionFromJson(Map<String, dynamic> json) => GovernanceRelationshipCollection(
  relationships: (json['relationships'] as List<dynamic>).map((e) => GovernanceRelationshipEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernanceRelationshipCollectionToJson(GovernanceRelationshipCollection instance) => <String, dynamic>{
  'relationships': instance.relationships,
};
