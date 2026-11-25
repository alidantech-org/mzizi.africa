import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/rank_row.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'ranking_screen.g.dart';

/// Ranking Screen
@JsonSerializable(includeIfNull: false)
class FrontendRankingScreen {
  const FrontendRankingScreen({required this.indicator, required this.language, required this.rows, this.unit, this.year});
  final SharedLocalizedText indicator;
  final String language;
  final List<FrontendRankRow> rows;
  final String? unit;
  final int? year;

  factory FrontendRankingScreen.fromJson(Map<String, dynamic> json) => _$FrontendRankingScreenFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendRankingScreenToJson(this);
}
