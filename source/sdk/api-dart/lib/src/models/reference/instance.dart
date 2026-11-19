import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/official/contacts.dart';
import 'package:mzizi_api/src/models/reference/template.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';
import 'package:mzizi_api/src/models/source/domains.dart';

part 'instance.g.dart';

/// The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified.
@JsonSerializable(includeIfNull: false)
class ReferenceInstance {
  const ReferenceInstance({
    this.contactId,
    required this.createdAt,
    this.deletedAt,
    this.domainId,
    required this.generatedAt,
    required this.id,
    this.institutionId,
    this.officeId,
    this.positionId,
    required this.statusId,
    required this.templateId,
    this.unitFeatureId,
    required this.updatedAt,
    this.verifiedCitationId,
    required this.version,
  });
  final String? contactId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? domainId;
  final DateTime generatedAt;
  final String id;
  final String? institutionId;
  final String? officeId;
  final String? positionId;
  final String statusId;
  final String templateId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final String? verifiedCitationId;
  final int version;

  factory ReferenceInstance.fromJson(Map<String, dynamic> json) => _$ReferenceInstanceFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceInstanceToJson(this);
}
