import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/ledger/manifesto.dart';

part 'manifesto_list.g.dart';

/// Manifesto List
@JsonSerializable(includeIfNull: false)
class LedgerManifestoList {
  const LedgerManifestoList({required this.gaps, required this.manifestos});
  final List<String> gaps;
  final List<LedgerManifesto> manifestos;

  factory LedgerManifestoList.fromJson(Map<String, dynamic> json) => _$LedgerManifestoListFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerManifestoListToJson(this);
}
