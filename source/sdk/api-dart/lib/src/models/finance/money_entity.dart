import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'money_entity.g.dart';

/// Base for records that carry an amount in minor units and its currency.
@JsonSerializable(includeIfNull: false)
class FinanceMoneyEntity {
  const FinanceMoneyEntity({
    required this.amountMinorUnits,
    required this.code,
    required this.createdAt,
    required this.currencyId,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final int amountMinorUnits;
  final String code;
  final DateTime createdAt;
  final String currencyId;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory FinanceMoneyEntity.fromJson(Map<String, dynamic> json) => _$FinanceMoneyEntityFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceMoneyEntityToJson(this);
}
