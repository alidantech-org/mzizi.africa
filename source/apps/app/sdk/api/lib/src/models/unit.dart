import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';

part 'unit.g.dart';

/// Measurement unit and conversion to its optional base unit; never a spatial unit.
@JsonSerializable(includeIfNull: false)
class Unit {
  const Unit({
    this.baseId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.offset,
    required this.quantity,
    required this.scale,
    required this.symbol,
    required this.updatedAt,
    required this.version,
  });
  final String? baseId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final double offset;
  final String quantity;
  final double scale;
  final String symbol;
  final DateTime updatedAt;
  final int version;

  factory Unit.fromJson(Map<String, dynamic> json) => _$UnitFromJson(json);

  Map<String, dynamic> toJson() => _$UnitToJson(this);
}