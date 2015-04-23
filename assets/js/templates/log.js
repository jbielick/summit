<?
	var logClasses = {
		error	: 'danger',
		notice	: 'default',
		warning : 'warning',
		authnet	: 'info',
		info	: 'primary'
	};
?>
<div class="panel log slide-up panel-<?=logClasses[Log.type] || 'default'?>">
	<div class="panel-heading">
		<h3 class="panel-title">
			<?= Log.child_count ? '<span class="badge badge-'+(logClasses[Log.type] || 'default')+'">'+(Log.child_count+1)+'</span>' : '' ?>
<?
			if (!Log.closed) {
?>
			<a class="pull-right" href="javascript:void(0)" data-behavior="dismiss" title="Delete">&times;</a>
<?
			}
			if (Log.Site) {
?>
				<a href="/feed?Site.name=<?=Log.Site.name?>" data-id="<?= Log.Site.id ?>" data-behavior="project/open"><?= Log.Site.name ?></a>
<?
			} else {
?>
				<?= Log.host || 'Unknown Origin' ?>
<?
			}
?>
			<small>|</small>
			<? var d = new Date(Log.createdAt) ?> <?= d.toLocaleString() ?>
			<small>|</small>
			<span><?= Log.type ? Log.type.toUpperCase() : 'error' ?></span>
		</h3>
	</div>
	<div class="panel-body">
		<pre>
			<?= Log.data ?>
		</pre>
		<div class="row">
			<div class="col-xs-6 text-left">
				<small>URI: <strong><?= Log.uri || 'n/a' ?></strong></small>
				<br>
				<small>ID: <strong><?= Log.id ?></strong></small>
			</div>
			<div class="col-xs-6 text-right padv8">
				<a class="btn btn-sm btn-default" href="javascript:void(0)" data-behavior="openNotes"><?= Log.notes ? 'Open Notes' : 'Add Notes' ?></a>
			</div>
		</div>
		<div class="notes" hidden>
			<textarea class="form-control" name="notes"><?= Log.notes || '' ?></textarea>
		</div>
	</div>
</div>