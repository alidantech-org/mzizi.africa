// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'power_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePowerCollection _$GovernancePowerCollectionFromJson(Map<String, dynamic> json) => GovernancePowerCollection(
  powers: (json['powers'] as List<dynamic>).map((e) => GovernancePowerEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernancePowerCollectionToJson(GovernancePowerCollection instance) => <String, dynamic>{'powers': instance.powers};
