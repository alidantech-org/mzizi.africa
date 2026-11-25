// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsPartyCollection _$PoliticsPartyCollectionFromJson(Map<String, dynamic> json) => PoliticsPartyCollection(
  parties: (json['parties'] as List<dynamic>).map((e) => PoliticsPartyEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$PoliticsPartyCollectionToJson(PoliticsPartyCollection instance) => <String, dynamic>{'parties': instance.parties};
