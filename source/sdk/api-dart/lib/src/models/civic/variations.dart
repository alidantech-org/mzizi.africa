import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'variations.g.dart';

/// One change to an executed contract: a variation of price or scope, an extension, a renewal or a termination.
@JsonSerializable(includeIfNull: false)
class CivicVariations {
  const CivicVariations({
    this.amountDeltaMinorUnits,
    required this.code,
    required this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.id,
    required this.kindId,
    this.newEndOn,
    this.reason,
    this.signedOn,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final int? amountDeltaMinorUnits;
  final String code;
  final String contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String id;
  final String kindId;
  final DateTime? newEndOn;
  final String? reason;
  final DateTime? signedOn;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory CivicVariations.fromJson(Map<String, dynamic> json) => _$CivicVariationsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicVariationsToJson(this);
}
