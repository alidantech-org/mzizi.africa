import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

/// Runs [load] (which reads the API) and shows loading, the failure with a retry, or [builder] with the value.
/// It reloads when [reloadKey] or the interface language changes.
class AsyncPage<T> extends ConsumerStatefulWidget {
  const AsyncPage({
    super.key,
    required this.reloadKey,
    required this.load,
    required this.builder,
    this.loading = const LoadingView(),
  });

  final String reloadKey;
  final Widget loading;
  final Future<ApiResult<T>> Function(String language) load;
  final Widget Function(BuildContext context, T value) builder;

  @override
  ConsumerState<AsyncPage<T>> createState() => _AsyncPageState<T>();
}

class _AsyncPageState<T> extends ConsumerState<AsyncPage<T>> {
  Future<ApiResult<T>>? _future;
  String _loadedFor = '';

  void _start(String language) {
    _loadedFor = '${widget.reloadKey}|$language';
    _future = widget.load(language);
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    if (_loadedFor != '${widget.reloadKey}|$language') _start(language);
    return FutureBuilder<ApiResult<T>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return widget.loading;
        }
        final result = snapshot.data;
        final value = result?.dataOrNull;
        if (result == null || result.isError || value == null) {
          return ErrorView(
            message: result?.message ?? '${snapshot.error}',
            retryLabel: tr(language, 'retry'),
            onRetry: () => setState(() => _start(language)),
          );
        }
        return RefreshIndicator(
          onRefresh: () async {
            setState(() => _start(language));
            await _future;
          },
          child: widget.builder(context, value),
        );
      },
    );
  }
}
