import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/governance/templates.dart';
import 'package:mzizi_api/src/models/official/contacts.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/domains.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'instances.g.dart';

/// Which template produced which record, for which place, and whether it is only expected or has been found.
@JsonSerializable(includeIfNull: false)
class GovernanceInstances {
  const GovernanceInstances({
    this.contactId,
    required this.createdAt,
    this.deletedAt,
    this.domainId,
    required this.generatedAt,
    required this.id,
    this.institutionId,
    this.officeId,
    this.positionId,
    required this.statusTerm,
    required this.templateId,
    this.unitFeatureId,
    required this.updatedAt,
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
  final String statusTerm;
  final String templateId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceInstances.fromJson(Map<String, dynamic> json) => _$GovernanceInstancesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstancesToJson(this);
}
