import 'package:json_annotation/json_annotation.dart';

part 'fund.g.dart';

/// Fund
@JsonSerializable(includeIfNull: false)
class LedgerFund {
  const LedgerFund({
    required this.code,
    this.featureId,
    required this.flows,
    required this.kind,
    this.manager,
    this.path,
    this.place,
    this.source,
  });
  final String code;
  final String? featureId;
  final int flows;
  final String kind;
  final String? manager;
  final String? path;
  final String? place;
  final String? source;

  factory LedgerFund.fromJson(Map<String, dynamic> json) => _$LedgerFundFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerFundToJson(this);
}
