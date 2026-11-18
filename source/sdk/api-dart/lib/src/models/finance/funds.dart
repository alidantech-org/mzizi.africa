import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'funds.g.dart';

/// One named public fund with a classification, manager and country.
@JsonSerializable(includeIfNull: false)
class FinanceFunds {
  const FinanceFunds({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.fundKindId,
    this.fundingSourceId,
    required this.id,
    this.managingEntityId,
    this.scopeUnitFeatureId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fundKindId;
  final String? fundingSourceId;
  final String id;
  final String? managingEntityId;
  final String? scopeUnitFeatureId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory FinanceFunds.fromJson(Map<String, dynamic> json) => _$FinanceFundsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFundsToJson(this);
}
