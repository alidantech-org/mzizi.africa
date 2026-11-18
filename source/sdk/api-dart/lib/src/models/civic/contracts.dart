import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'contracts.g.dart';

/// One executed contract with a contractor, optional procurement/project links and contracted amount.
@JsonSerializable(includeIfNull: false)
class CivicContracts {
  const CivicContracts({
    required this.amountMinorUnits,
    required this.code,
    required this.contractorEntityId,
    required this.createdAt,
    required this.currencyId,
    this.deletedAt,
    required this.id,
    this.natureId,
    this.procurementId,
    this.projectId,
    this.signedOn,
    this.sourceCitationId,
    required this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final int amountMinorUnits;
  final String code;
  final String contractorEntityId;
  final DateTime createdAt;
  final String currencyId;
  final DateTime? deletedAt;
  final String id;
  final String? natureId;
  final String? procurementId;
  final String? projectId;
  final DateTime? signedOn;
  final String? sourceCitationId;
  final String statusId;
  final DateTime updatedAt;
  final int version;

  factory CivicContracts.fromJson(Map<String, dynamic> json) => _$CivicContractsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicContractsToJson(this);
}
