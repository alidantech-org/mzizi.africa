// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_detail_holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeDetailHolders _$GovernanceOfficeDetailHoldersFromJson(Map<String, dynamic> json) => GovernanceOfficeDetailHolders(
  appointment: json['appointment'] as String,
  individualId: json['individualId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceOfficeDetailHoldersNames.fromJson(e as Map<String, dynamic>)).toList(),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
);

Map<String, dynamic> _$GovernanceOfficeDetailHoldersToJson(GovernanceOfficeDetailHolders instance) => <String, dynamic>{
  'appointment': instance.appointment,
  'individualId': instance.individualId,
  'names': instance.names,
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
};
