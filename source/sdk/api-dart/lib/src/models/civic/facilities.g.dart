// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facilities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicFacilities _$CivicFacilitiesFromJson(Map<String, dynamic> json) => CivicFacilities(
  closedOn: json['closedOn'] == null ? null : DateTime.parse(json['closedOn'] as String),
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  facilityClassId: json['facilityClassId'] as String,
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  openedOn: json['openedOn'] == null ? null : DateTime.parse(json['openedOn'] as String),
  operatorEntityId: json['operatorEntityId'] as String?,
  ownerEntityId: json['ownerEntityId'] as String?,
  ownershipId: json['ownershipId'] as String?,
  responsibleInstitutionId: json['responsibleInstitutionId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  statusId: json['statusId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicFacilitiesToJson(CivicFacilities instance) => <String, dynamic>{
  'closedOn': ?instance.closedOn?.toIso8601String(),
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'facilityClassId': instance.facilityClassId,
  'featureId': instance.featureId,
  'id': instance.id,
  'openedOn': ?instance.openedOn?.toIso8601String(),
  'operatorEntityId': ?instance.operatorEntityId,
  'ownerEntityId': ?instance.ownerEntityId,
  'ownershipId': ?instance.ownershipId,
  'responsibleInstitutionId': ?instance.responsibleInstitutionId,
  'sourceCitationId': ?instance.sourceCitationId,
  'statusId': instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
