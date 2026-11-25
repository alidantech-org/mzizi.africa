import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'variations.g.dart';

/// A change to a contract's price, period or scope.
@JsonSerializable(includeIfNull: false)
class CivicVariations {
  const CivicVariations({
    this.amountChange,
    required this.code,
    required this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.id,
    required this.kindTerm,
    this.newEndOn,
    this.note,
    this.noteLanguageId,
    this.signedOn,
    required this.updatedAt,
    required this.version,
  });
  final int? amountChange;
  final String code;
  final String contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String id;
  final String kindTerm;
  final DateTime? newEndOn;
  final String? note;
  final String? noteLanguageId;
  final DateTime? signedOn;
  final DateTime updatedAt;
  final int version;

  factory CivicVariations.fromJson(Map<String, dynamic> json) => _$CivicVariationsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicVariationsToJson(this);
}
