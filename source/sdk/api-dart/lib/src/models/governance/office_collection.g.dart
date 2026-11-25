// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeCollection _$GovernanceOfficeCollectionFromJson(Map<String, dynamic> json) => GovernanceOfficeCollection(
  offices: (json['offices'] as List<dynamic>).map((e) => GovernanceOfficeEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernanceOfficeCollectionToJson(GovernanceOfficeCollection instance) => <String, dynamic>{'offices': instance.offices};
