import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';

part 'baskets.g.dart';

/// A set of goods with weights (a CPI basket).
@JsonSerializable(includeIfNull: false)
class EconomyBaskets {
  const EconomyBaskets({
    required this.code,
    this.collectionId,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? collectionId;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory EconomyBaskets.fromJson(Map<String, dynamic> json) => _$EconomyBasketsFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyBasketsToJson(this);
}
