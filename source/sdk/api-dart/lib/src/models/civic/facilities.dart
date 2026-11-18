import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'facilities.g.dart';

/// The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links.
@JsonSerializable(includeIfNull: false)
class CivicFacilities {
  const CivicFacilities({
    this.closedOn,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.facilityClassId,
    required this.featureId,
    required this.id,
    this.openedOn,
    this.operatorEntityId,
    this.ownerEntityId,
    this.ownershipId,
    this.responsibleInstitutionId,
    this.sourceCitationId,
    required this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? closedOn;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String facilityClassId;
  final String featureId;
  final String id;
  final DateTime? openedOn;
  final String? operatorEntityId;
  final String? ownerEntityId;
  final String? ownershipId;
  final String? responsibleInstitutionId;
  final String? sourceCitationId;
  final String statusId;
  final DateTime updatedAt;
  final int version;

  factory CivicFacilities.fromJson(Map<String, dynamic> json) => _$CivicFacilitiesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicFacilitiesToJson(this);
}
