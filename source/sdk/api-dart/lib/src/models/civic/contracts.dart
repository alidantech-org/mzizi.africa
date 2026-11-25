import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'contracts.g.dart';

/// A signed contract.
@JsonSerializable(includeIfNull: false)
class CivicContracts {
  const CivicContracts({
    this.amount,
    required this.buyerId,
    required this.code,
    required this.contractorId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.endsOn,
    required this.id,
    required this.natureTerm,
    this.procurementId,
    this.projectId,
    this.signedOn,
    this.startsOn,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String buyerId;
  final String code;
  final String contractorId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String id;
  final String natureTerm;
  final String? procurementId;
  final String? projectId;
  final DateTime? signedOn;
  final DateTime? startsOn;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory CivicContracts.fromJson(Map<String, dynamic> json) => _$CivicContractsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicContractsToJson(this);
}
