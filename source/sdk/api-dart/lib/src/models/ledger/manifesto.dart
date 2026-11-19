import 'package:json_annotation/json_annotation.dart';

part 'manifesto.g.dart';

/// Manifesto
@JsonSerializable(includeIfNull: false)
class LedgerManifesto {
  const LedgerManifesto({required this.code, this.election, this.party, this.publishedOn});
  final String code;
  final String? election;
  final String? party;
  final String? publishedOn;

  factory LedgerManifesto.fromJson(Map<String, dynamic> json) => _$LedgerManifestoFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerManifestoToJson(this);
}
