import 'package:json_annotation/json_annotation.dart';

part 'coalition.g.dart';

/// Coalition
@JsonSerializable(includeIfNull: false)
class LedgerCoalition {
  const LedgerCoalition({required this.code, this.dissolvedOn, this.formedOn, required this.kind, required this.name});
  final String code;
  final String? dissolvedOn;
  final String? formedOn;
  final String kind;
  final String name;

  factory LedgerCoalition.fromJson(Map<String, dynamic> json) => _$LedgerCoalitionFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerCoalitionToJson(this);
}
